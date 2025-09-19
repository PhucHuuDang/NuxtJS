<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-vue-next";

import { useBaseUrl } from "~/composables/url";

import type { ProductDetailResponse } from "~/types/product.types";
import type { CarouselApi } from "~/components/ui/carousel";
import { watchOnce } from "@vueuse/core";

const config = useRuntimeConfig();
const url = config.public.apiBase;

const { slug } = useRoute().params;

const {
  data: product,
  error: productError,
  refresh,
  clear,
  status,
  execute,
} = useFetch<ProductDetailResponse>(`${url}/products/${slug}`, {
  key: `product-${slug}`,
});

const emblaMainApi = ref<CarouselApi>();
const emblaThumbnailApi = ref<CarouselApi>();
const selectedIndex = ref(0);

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap();
  emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap());
}

function onThumbClick(index: number) {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
  emblaMainApi.value.scrollTo(index);
}

watchOnce(emblaMainApi, (emblaMainApi) => {
  if (!emblaMainApi) return;

  onSelect();
  emblaMainApi.on("select", onSelect);
  emblaMainApi.on("reInit", onSelect);
});
</script>

<template>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold my-4 text-slate-700">
      {{ product?.title }}
    </h1>
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2" v-if="product">
      <div class="w-full sm:w-auto">
        <Carousel
          class="relative w-full max-w-full"
          @init-api="(val) => (emblaMainApi = val)"
        >
          <CarouselContent>
            <CarouselItem v-for="(_, index) in product.images" :key="index">
              <div class="p-1">
                <Card>
                  <CardContent
                    class="flex aspect-square items-center justify-center p-6"
                  >
                    <img
                      :src="product.images[index]"
                      alt="Main image"
                      class="w-full h-full object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <Carousel
          class="relative w-full max-w-full"
          @init-api="(val) => (emblaThumbnailApi = val)"
        >
          <CarouselContent class="flex gap-1 ml-0">
            <CarouselItem
              v-for="(_, index) in product.images"
              :key="index"
              class="pl-0 basis-1/4 cursor-pointer"
              @click="onThumbClick(index)"
            >
              <div
                class="p-1"
                :class="index === selectedIndex ? '' : 'opacity-50'"
              >
                <Card>
                  <CardContent
                    class="flex aspect-square items-center justify-center p-6"
                  >
                    <img
                      :src="product.images[index]"
                      alt="Main image"
                      class="w-full h-full object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      <!-- Product Info -->
      <Card class="p-4">
        <CardHeader>
          <CardTitle class="text-2xl font-bold">{{ product.title }}</CardTitle>
          <p class="text-sm text-muted-foreground">{{ product.brand }}</p>
        </CardHeader>

        <CardContent>
          <p class="mb-3 text-gray-600">{{ product.description }}</p>

          <!-- Price + Discount -->
          <div class="mb-3 flex items-center gap-2">
            <span class="text-2xl font-bold text-primary"
              >${{ product.price }}</span
            >
            <Badge variant="secondary"
              >-{{ product.discountPercentage }}%</Badge
            >
          </div>

          <!-- Rating -->
          <div class="mb-3 flex items-center gap-1 text-yellow-500">
            <Star
              v-for="i in 5"
              :key="i"
              :class="
                i <= Math.round(product.rating)
                  ? 'fill-yellow-500'
                  : 'opacity-30'
              "
              class="h-5 w-5"
            />
            <span class="ml-2 text-sm text-muted-foreground">
              {{ product.rating.toFixed(1) }}
            </span>
          </div>

          <!-- Stock -->
          <p
            :class="[
              'mb-3 font-medium',
              product.stock > 10
                ? 'text-green-600'
                : product.stock > 0
                  ? 'text-orange-500'
                  : 'text-red-500',
            ]"
          >
            {{ product.availabilityStatus }} ({{ product.stock }} left)
          </p>

          <!-- Tags -->
          <div class="mb-4 flex flex-wrap gap-2">
            <Badge v-for="tag in product.tags" :key="tag" variant="outline">
              {{ tag }}
            </Badge>
          </div>

          <Separator />

          <!-- Tabs for Details -->

          <Tabs default-value="details" class="mt-4 w-full">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <!-- Details Tab -->
            <TabsContent value="details" class="mt-3 space-y-2 text-sm">
              <p><strong>SKU:</strong> {{ product.sku }}</p>
              <p><strong>Weight:</strong> {{ product.weight }}g</p>
              <p>
                <strong>Dimensions:</strong> {{ product.dimensions.width }} ×
                {{ product.dimensions.height }} ×
                {{ product.dimensions.depth }} cm
              </p>
              <p>
                <strong>Warranty:</strong> {{ product.warrantyInformation }}
              </p>
              <p><strong>Return Policy:</strong> {{ product.returnPolicy }}</p>
              <p>
                <strong>Minimum Order:</strong>
                {{ product.minimumOrderQuantity }}
              </p>
            </TabsContent>

            <!-- Shipping Tab -->
            <TabsContent value="shipping" class="mt-3 text-sm">
              <p>
                <strong>Shipping:</strong> {{ product.shippingInformation }}
              </p>
              <p><strong>Barcode:</strong> {{ product.meta.barcode }}</p>
              <img
                :src="product.meta.qrCode"
                alt="QR Code"
                class="mt-2 h-24 w-24"
              />
            </TabsContent>

            <!-- Reviews Tab -->
            <TabsContent value="reviews" class="mt-3">
              <ScrollArea class="h-40 pr-4">
                <div
                  v-for="(review, i) in product.reviews"
                  :key="i"
                  class="mb-3 rounded-lg border p-3"
                >
                  <div class="flex items-center justify-between">
                    <p class="font-medium">{{ review.reviewerName }}</p>
                    <div class="flex gap-1 text-yellow-500">
                      <Star
                        v-for="i in 5"
                        :key="i"
                        :class="
                          i <= review.rating ? 'fill-yellow-500' : 'opacity-30'
                        "
                        class="h-4 w-4"
                      />
                    </div>
                  </div>
                  <p class="text-sm text-gray-600">{{ review.comment }}</p>
                  <p class="mt-1 text-xs text-muted-foreground">
                    {{ new Date(review.date).toLocaleDateString() }}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter class="flex items-center justify-between">
          <Button size="lg">Add to Cart</Button>
          <Button variant="outline" size="lg">Buy Now</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
