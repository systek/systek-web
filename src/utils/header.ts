// apply bottom border when header is sticky and pinned
const borderClass = ["border-b", "border-grey-91"];
let observer: IntersectionObserver | null = null;

export function setupHeader(header: HTMLElement, sentinel: HTMLElement) {
  document.body.style.setProperty(
    "--width-scrollbar",
    `${window.innerWidth - document.body.clientWidth}px`,
  );
  document.body.style.setProperty(
    "--height-header",
    `${header.offsetHeight}px`,
  );

  // header is not sticky on mobile
  if (window.innerWidth < 800) {
    if (observer) {
      observer.disconnect();
      observer = null;
      header.classList.remove(...borderClass);
    }
    return;
  }

  if (observer) return;

  observer = new window.IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        header.classList.add(...borderClass);
      } else {
        header.classList.remove(...borderClass);
      }
    },
    { threshold: [0] },
  );
  observer.observe(sentinel);
}

export const openModal = (
  modal: HTMLDialogElement,
  scrollTarget: HTMLElement,
) => {
  scrollTarget.scrollIntoView({
    behavior: "instant",
    block: "start",
  });

  modal.classList.remove("hidden");
  modal.showModal();

  modal.addEventListener(
    "click",
    (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    },
    { once: true },
  );

  requestAnimationFrame(() => {
    window.addEventListener("scroll", () => closeModal(modal), { once: true });
  });
};

export const closeModal = (modal: HTMLDialogElement) => {
  modal.classList.add("modal-animate");
  modal.close();

  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }, 150);
};
