(function () {
  function normalizeYouTubeUrl(url) {
    if (!url) {
      return "";
    }

    try {
      var parsed = new URL(url, window.location.href);
      var host = parsed.hostname.replace(/^www\./, "");

      if (host === "youtu.be") {
        return "https://www.youtube.com/embed/" + parsed.pathname.replace("/", "");
      }

      if (host === "youtube.com" || host === "m.youtube.com") {
        if (parsed.pathname === "/watch") {
          var videoId = parsed.searchParams.get("v");
          return videoId ? "https://www.youtube.com/embed/" + videoId : "";
        }

        if (parsed.pathname.indexOf("/embed/") === 0) {
          return parsed.href;
        }
      }
    } catch (error) {
      return "";
    }

    return "";
  }

  function initSlider(slider) {
    var buttons = Array.prototype.slice.call(slider.querySelectorAll("[data-slide-index]"));
    var image = slider.querySelector("[data-slider-image]");
    var placeholder = slider.querySelector("[data-slider-placeholder]");
    var caption = slider.querySelector("[data-slider-caption]");
    var counter = slider.querySelector("[data-slider-count]");
    var prev = slider.querySelector("[data-slider-prev]");
    var next = slider.querySelector("[data-slider-next]");

    if (!buttons.length || !image || !placeholder || !caption || !counter) {
      return;
    }

    var currentIndex = 0;

    function render(index) {
      var button = buttons[index];
      var src = button.getAttribute("data-slide-src") || "";
      var alt = button.getAttribute("data-slide-alt") || "";
      var text = button.getAttribute("data-slide-text") || "Add screenshot here.";
      var label = button.getAttribute("data-slide-label") || "";

      currentIndex = index;
      counter.textContent = index + 1 + " / " + buttons.length;
      caption.textContent = label ? label + ": " + text : text;

      buttons.forEach(function (item, itemIndex) {
        item.classList.toggle("active", itemIndex === index);
      });

      if (src) {
        image.src = src;
        image.alt = alt || label || "Project screenshot";
        image.style.display = "block";
        placeholder.style.display = "none";
        return;
      }

      image.removeAttribute("src");
      image.style.display = "none";
      placeholder.textContent = text;
      placeholder.style.display = "flex";
    }

    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        render(index);
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        render((currentIndex - 1 + buttons.length) % buttons.length);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        render((currentIndex + 1) % buttons.length);
      });
    }

    render(0);
  }

  function initVideo(videoBox) {
    var frame = videoBox.querySelector("[data-video-frame]");
    var fallback = videoBox.querySelector("[data-video-placeholder]");

    if (!frame || !fallback) {
      return;
    }

    var url = videoBox.getAttribute("data-video-url") || "";
    var embedUrl = normalizeYouTubeUrl(url);

    if (!embedUrl) {
      frame.style.display = "none";
      fallback.style.display = "flex";
      return;
    }

    fallback.style.display = "none";
    frame.style.display = "block";
    frame.src = embedUrl;
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-slider]"), initSlider);
  Array.prototype.forEach.call(document.querySelectorAll("[data-video-url]"), initVideo);
})();
