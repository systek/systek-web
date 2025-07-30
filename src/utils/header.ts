// apply bottom border when header is sticky and pinned
const borderClass = ["border-b", "border-grey-91"];
let observer: IntersectionObserver | null = null;

export function setupHeader(header: HTMLElement, sentinel: HTMLElement) {
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
  const body = document.body;
  modal.classList.add("modal-animate");

  modal.close();

  setTimeout(() => {
    modal.classList.add("hidden");
    body.style.overflow = "auto";
  }, 150);
};
