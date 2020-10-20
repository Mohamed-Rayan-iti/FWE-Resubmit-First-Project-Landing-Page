/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * highlights section in viewport upon scrolling,
 * actives navigation links upon when section in viewport
 * button to scroll page to top,
 * Hide and show the navigationBar and
 * sections collapsible.
 *   
 * 
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Model start
 * model holds all the data associated with the page
 */
let model = {
  NavigationBarHeight: "55px",
};

/**
 * End model
 */

/**
 * controller start
 * controller is the link between the model and the view
 */

const controller = {
  initialization: () => {
    view.initialization();
  },

  getNavigationBarHeight: () => model.NavigationBarHeight,
};
/**
 * End controller
 */

/**
 * View start
 * View is responsible of manipulating the DOM and will access the data
 * stored in the model through the controller
 */

const view = {
  // start main function
  initialization: function () {
    this.initializationNavigationBar("#navbar__list");
    this.mainContentScrollHandlers(100);
    this.scrollUp();
    this.switchActiveStatus();
    this.sectionsCollapsible();
  },

  // Helper function to check if element is in the viewport
  isOnScreen: (element, buffer) => {
    buffer = typeof buffer === "undefined" ? 0 : buffer;
    // Get element's position in the viewport
    const rect = element.getBoundingClientRect();

    // Check if element is in the viewport
    let isInViewport;
    rect.top >= buffer &&
    rect.left >= buffer &&
    rect.right <=
    // fallback for browser compatibility
      (window.innerWidth || document.documentElement.clientWidth) - buffer &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) - buffer
      ? (isInViewport = true)
      : (isInViewport = false);
    return isInViewport;
  },

  // build the navigationBar
  initializationNavigationBar: (NavigationElement) => {
    const navigation = document.querySelector(NavigationElement);
    const sections = document.querySelectorAll("section");
    let firstLink = true;
    sections.forEach((section) => {
      const NavigationLink = document.createElement("li");
      NavigationLink.innerHTML = `<a href="#${section.id}" class="menu__link ${
        firstLink ? "link__active" : ""
      }" data-link="${section.dataset.nav}">
                    ${section.dataset.nav}
                </a>`;
      navigation.appendChild(NavigationLink);
      firstLink = false;
    });
  },

  mainContentScrollHandlers: (buffer) => {
    const navigation = document.getElementsByClassName("page__header")[0];
    let previousPosition = window.scrollY;
    let firstScroll = true;
    const sections = document.getElementsByTagName("section");
    const activeEvent = new Event("active");
    window.onscroll = function () {
      const currentPosition = window.scrollY;

      // Show button to scroll page to top
      const scroller = document.getElementById("scrollUp");
      if (currentPosition > buffer || currentPosition > 100) {
        scroller.classList.remove("display__none");
      } else {
        scroller.classList.add("display__none");
      }

      // Hide and show the navigationBar
      if (firstScroll) {
        if (currentPosition - previousPosition > 50) {
          navigation.style.top = "-" + controller.getNavigationBarHeight();
          previousPosition = currentPosition;
          firstScroll = false;
        } else if (previousPosition - currentPosition > 50) {
          previousPosition = currentPosition;
        }
      } else {
        if (previousPosition < currentPosition) {
          previousPosition = currentPosition;
        } else {
          if (previousPosition - currentPosition > 50) {
            navigation.style.top = "0";
            firstScroll = true;
            previousPosition = currentPosition;
          }
        }
      }
      // Dispatch event to all the sections in order to
      // show the active state
      setTimeout(function () {
        for (let section of sections) {
          section.dispatchEvent(activeEvent);
        }
      });
    };
  },

  scrollUp: () => {
    const scroller = document.getElementById("scrollUp");
    scroller.addEventListener("click", (event) => {
      const animatedScrolling = () => {
        const currentViewport = window.scrollY;
        if (currentViewport > 0) {
          window.requestAnimationFrame(animatedScrolling);
          window.scrollTo(0, currentViewport - currentViewport / 8);
        }
      };
      window.requestAnimationFrame(animatedScrolling);
    });
  },

  // Add event listeners to the sections that listen for active
  // event. This event is triggered during window scroll.
  switchActiveStatus: () => {
    const sections = document.getElementsByTagName("section");
    for (let section of sections) {
      section.addEventListener("active", function () {
        const isOnScreen = view.isOnScreen(this, -300);
        const NavigationLink = document.querySelectorAll(
          `[data-link="${this.dataset.nav}"]`
        )[0];
        if (isOnScreen) {
          this.classList.add("active");
          NavigationLink.classList.add("link__active");
        } else {
          this.classList.remove("active");
          NavigationLink.classList.remove("link__active");
        }
      });
    }
  },

  sectionsCollapsible: () => {
    // Get all the <h2> headings
    const headings = document.querySelectorAll("main h2");

    Array.prototype.forEach.call(headings, (heading) => {
      // Give each <h2> a toggle button child
      // with the SVG plus/minus icon
      heading.innerHTML = `
        <button aria-expanded="true">
          ${heading.textContent}
          <svg aria-hidden="true" focusable="false" viewBox="0 0 10 10">
            <rect class="vert" height="8" width="2" y="1" x="4"/>
            <rect height="2" width="8" y="4" x="1"/>
          </svg>
        </button>
      `;

      // Function to create a node list
      // of the content between this <h2> and the next
      const getContent = (element) => {
        let elements = [];
        while (
          element.nextElementSibling &&
          element.nextElementSibling.tagName !== "H2"
        ) {
          elements.push(element.nextElementSibling);
          element = element.nextElementSibling;
        }

        // Delete the old versions of the content nodes
        elements.forEach((node) => {
          node.parentNode.removeChild(node);
        });

        return elements;
      };

      // Assign the contents to be expanded/collapsed (array)
      let contents = getContent(heading);

      // Create a wrapper element for `contents` and hide it
      let wrapper = document.createElement("div");
      wrapper.hidden = false;

      // Add each element of `contents` to `wrapper`
      contents.forEach((node) => {
        wrapper.appendChild(node);
      });

      // Add the wrapped content back into the DOM
      // after the heading
      heading.parentNode.insertBefore(wrapper, heading.nextElementSibling);

      // Assign the button
      let btn = heading.querySelector("button");

      btn.onclick = () => {
        // Cast the state as a boolean
        let expanded = btn.getAttribute("aria-expanded") === "true" || false;

        // Switch the state
        btn.setAttribute("aria-expanded", !expanded);
        // Switch the content's visibility
        wrapper.hidden = expanded;
      };
    });
  },
};

/**
 * initialization the application
 */
controller.initialization();
