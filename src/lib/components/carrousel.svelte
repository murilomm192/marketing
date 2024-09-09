<script>
  export let images = [
    "https://picsum.photos/300?id=1",
    "https://picsum.photos/200?id=2",
    "https://picsum.photos/200?id=3",
  ];
  let currentIndex = 0;
  $: image = images[currentIndex];

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
  }
</script>

<div class="h-full flex object-scale-down justify-around">
  <button class="nav-button prev" on:click={prevImage}>&lt;</button>
  <a href={image} class="">
    <img src={image} class="" alt="Carousel image" />
  </a>
  <button class="nav-button next" on:click={nextImage}>&gt;</button>
</div>

<style>
  .nav-button {
    top: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .nav-button:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .prev {
    left: 10px;
  }

  .next {
    right: 10px;
  }
</style>
