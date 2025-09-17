<script setup lang="ts">
import type { ProductResponse } from "@/types/product.types";
import { useBaseUrl } from "~/composables/url";
import { watchDebounced } from "@vueuse/core";

const url = useBaseUrl();

const products = ref<ProductResponse>();
const categories = ref<string[]>([]);

const isPending = ref<boolean>(false);
const total = computed<number>(() => products.value?.total || 0);

const itemsPerPage = ref<number>(10);
const currentPage = ref<number>(1);
const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value));

const selectedCategory = ref<string>("all");

const sortBy = ref<string>("title");
const sortOrder = ref<"asc" | "desc">("asc");

const searchProducts = shallowRef<string>("");

const debouncedSearchProducts = shallowRef<string>("");

const placeholders = [
  "Why is my code always broken?",
  "What does 'undefined' even mean?",
  "How to center a div (for real this time)",
  "Am I smarter than a compiler?",
  "Do loops ever get dizzy?",
];

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const errorMessage = ref<string | null>(null);

const fetchCategories = async () => {
  const { data, error } = await useFetch(`${url}/products/category-list`, {
    key: "category-list",
  });

  if (error.value) {
    console.error("Failed to load categories", error.value);
    return;
  }
  if (data.value) {
    categories.value = data.value as string[];
  }
};

const fetchProducts = async () => {
  isPending.value = true;
  errorMessage.value = null;
  const skip = (currentPage.value - 1) * itemsPerPage.value;
  const query = new URLSearchParams({
    limit: String(itemsPerPage.value),
    skip: String(skip),
    sortBy: sortBy.value,
    order: sortOrder.value,
    select:
      "title,price,thumbnail,brand,description,rating,stock,discountPercentage,tags",
  });
  let basePath =
    selectedCategory.value !== "all"
      ? `/products/category/${selectedCategory.value}`
      : `/products`;

  if (debouncedSearchProducts.value.trim() !== "") {
    basePath = "/products/search";
  } else if (selectedCategory.value !== "all") {
    basePath = `/products/category/${selectedCategory.value}`;
  }

  const fullUrl = `${url}${basePath}?${query.toString()}`;
  console.log("full url:", fullUrl);

  try {
    const data = await $fetch<ProductResponse>(fullUrl);
    products.value = data;
  } catch (err) {
    errorMessage.value = "Failed to load products.";
    console.error(err);
  } finally {
    isPending.value = false;
  }
};

watchDebounced(
  searchProducts,
  (value) => {
    debouncedSearchProducts.value = value;
    console.log({ debouncedSearchProducts: debouncedSearchProducts.value });
  },
  { debounce: 500 }
);
watch(
  [
    currentPage,
    itemsPerPage,
    selectedCategory,
    sortBy,
    sortOrder,
    debouncedSearchProducts,
  ],
  fetchProducts,
  { immediate: true }
);

onMounted(async () => {
  await fetchCategories();
});
</script>

<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold my-4 text-slate-700">Products</h1>

      <!-- <VanishingInput v-model="searchProducts" :placeholders="placeholders" /> -->
    </div>

    <div class="flex gap-4">
      <aside class="w-64 bg-slate-100 rounded-2xl p-4 shadow-lg">
        <h2 class="font-bold text-lg mb-4">Filters</h2>

        <!-- Category -->
        <div class="mb-6">
          <label class="font-medium block mb-2">Category</label>
          <select
            v-model="selectedCategory"
            class="w-full rounded-md border px-2 py-1"
          >
            <option value="all">All</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <!-- Sort -->
        <div class="mb-6">
          <label class="font-medium block mb-2">Sort By</label>
          <select v-model="sortBy" class="w-full rounded-md border px-2 py-1">
            <option value="title">Title</option>
            <option value="price">Price</option>
          </select>

          <div class="flex items-center gap-2 mt-2">
            <button
              class="flex-1 rounded-md border px-2 py-1"
              :class="sortOrder === 'asc' ? 'bg-blue-100' : ''"
              @click="sortOrder = 'asc'"
            >
              Asc
            </button>
            <button
              class="flex-1 rounded-md border px-2 py-1"
              :class="sortOrder === 'desc' ? 'bg-blue-100' : ''"
              @click="sortOrder = 'desc'"
            >
              Desc
            </button>
          </div>
        </div>
      </aside>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6"
      >
        <ProductCard
          v-for="product in products?.products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>

    <div class="my-10">
      <Pagination
        v-slot="{ page }"
        :items-per-page="itemsPerPage"
        :total="total"
        :page="currentPage"
        @update:page="handlePageChange"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious
            @click="handlePageChange(page - 1)"
            :disabled="currentPage === 1"
          />

          <template v-for="(item, index) in items" :key="index">
            <PaginationItem
              v-if="item.type === 'page'"
              :value="item.value"
              :is-active="item.value === currentPage"
              @click="handlePageChange(item.value)"
            >
              {{ item.value }}
            </PaginationItem>
          </template>

          <PaginationEllipsis :index="4" />

          <PaginationNext
            @click="handlePageChange(page + 1)"
            :disabled="currentPage === totalPages"
          />
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
