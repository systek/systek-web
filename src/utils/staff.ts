export function setupRadios(
  name: string,
  radios: NodeListOf<HTMLInputElement>,
  filterValues: { key: string; value: string }[],
  callback: () => void,
) {
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const filter = filterValues.find((filter) => filter.key === name);
      if (filter) {
        filter.value = radio.value;
        callback();
      }
    });
  });
}

export function toggleStaffVisibility(
  staff: HTMLElement,
  filterValues: { key: string; value: string }[],
): void {
  const isHidden = filterValues.some(
    (filter) =>
      filter.value !== "all" && staff.dataset[filter.key] !== filter.value,
  );
  if (isHidden) {
    staff.classList.add("hidden");
  } else {
    staff.classList.remove("hidden");
  }
}

export function toggleLetterVisibility(
  letter: HTMLElement,
  children: NodeListOf<HTMLElement>,
) {
  const isHidden = Array.from(children).every((staff) =>
    staff.classList.contains("hidden"),
  );

  if (isHidden) {
    letter.classList.add("hidden");
  } else {
    letter.classList.remove("hidden");
  }
}
