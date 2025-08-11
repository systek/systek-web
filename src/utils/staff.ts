/**
 * Uses IntersectionObserver to update .staff-letter
 * with the [data-letter] of the topmost visible element in .staff-list.
 */
function updateStaffLetterWithIntersectionObserver() {
  const staffList = document.querySelector<HTMLElement>(".staff-list");
  const staffLetter = document.querySelector<HTMLElement>(".staff-letter");
  if (!staffList || !staffLetter) return;

  const items = Array.from(
    staffList.querySelectorAll<HTMLElement>("[data-letter]")
  );

  const visibleItems = new Set<HTMLElement>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleItems.add(entry.target as HTMLElement);
        } else {
          visibleItems.delete(entry.target as HTMLElement);
        }
      }

      // Find the visible item closest to the top of the staff-list
      let topItem: HTMLElement | null = null;
      let minOffset = Infinity;
      const listRect = staffList.getBoundingClientRect();

      for (const item of visibleItems) {
        const itemRect = item.getBoundingClientRect();
        const offset = itemRect.top - listRect.top;
        if (
          itemRect.bottom > listRect.top &&
          offset >= 0 &&
          offset < minOffset
        ) {
          minOffset = offset;
          topItem = item;
        }
      }

      if (topItem) {
        const letter = topItem.getAttribute("data-letter");
        if (letter) staffLetter.innerText = letter;
      }
    },
    {
      root: null, // Use the viewport as the root since scrolling happens on the whole page
      threshold: 0,
    }
  );

  items.forEach((item) => observer.observe(item));
}

// Call this after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    updateStaffLetterWithIntersectionObserver
  );
} else {
  updateStaffLetterWithIntersectionObserver();
}
