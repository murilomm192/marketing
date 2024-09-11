<script>
  import { Card, CardContent } from "$lib/components/ui/card";
  import { writable } from "svelte/store";

  const images = [
    {
      id: 1,
      src: "/images/placeholder.png",
      alt: "Gallery image 1",
      height: "h-48",
    },
    {
      id: 2,
      src: "/images/placeholder.png",
      alt: "Gallery image 2",
      height: "h-64",
    },
    {
      id: 3,
      src: "/images/placeholder.png",
      alt: "Gallery image 3",
      height: "h-56",
    },
    {
      id: 4,
      src: "/images/placeholder.png",
      alt: "Gallery image 4",
      height: "h-72",
    },
    {
      id: 5,
      src: "/images/placeholder.png",
      alt: "Gallery image 5",
      height: "h-60",
    },
    {
      id: 6,
      src: "/images/placeholder.png",
      alt: "Gallery image 6",
      height: "h-52",
    },
    {
      id: 7,
      src: "/images/placeholder.png",
      alt: "Gallery image 7",
      height: "h-68",
    },
    {
      id: 8,
      src: "/images/placeholder.png",
      alt: "Gallery image 8",
      height: "h-56",
    },
  ];

  const clickedImages = writable([]);

  function handleImageClick(id) {
    clickedImages.update((ids) => {
      if (ids.includes(id)) {
        return ids.filter((i) => i !== id);
      } else {
        return [...ids, id];
      }
    });
  }
</script>

<section class="bg-background py-16 md:py-24">
  <div class="container mx-auto px-4">
    <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
      Image Gallery
    </h1>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {#each images as image (image.id)}
        <Card
          class="overflow-hidden cursor-pointer"
          on:click={() => handleImageClick(image.id)}
        >
          <CardContent class="p-0 relative">
            <img
              src={image.src}
              alt={image.alt}
              class="w-full {image.height} object-cover"
            />
            {#if $clickedImages.includes(image.id)}
              <div class="absolute inset-0 bg-red-500 bg-opacity-50 z-10"></div>
            {/if}
          </CardContent>
        </Card>
      {/each}
    </div>
  </div>
</section>
