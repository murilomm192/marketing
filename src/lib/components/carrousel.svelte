<script>
    export let images = ['https://picsum.photos/200?id=1','https://picsum.photos/200?id=2','https://picsum.photos/200?id=3',];
    let currentIndex = 0;
    $: image = images[currentIndex];
  
    function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
  }
  </script>
  
<div class="carousel h-full w-full">
    <button class="nav-button prev" on:click={prevImage}>&lt;</button>
    <img src={image} alt="Carousel image" />
    <button class="nav-button next" on:click={nextImage}>&gt;</button>
  </div>
  
  <style>
    .carousel {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      overflow: hidden;
    }
  
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  
    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
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
  
    @media (max-width: 768px) {
      .carousel {
        max-width: 100%;
      }
    }
  </style>