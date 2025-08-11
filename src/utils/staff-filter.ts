// src/utils/staff-filter.ts

export function filterStaff(
  staffElements: HTMLElement[],
  locationFilter: string,
  departmentFilter: string
): void {
  staffElements.forEach((el) => {
    const location = el.getAttribute("data-location") || "";
    const department = el.getAttribute("data-department") || "";
    // No filter applied
    if (!locationFilter && !departmentFilter) {
      el.style.display = "";
      return;
    }
    // Check if the element matches the filter criteria
    if (
      (departmentFilter && department !== departmentFilter) ||
      (locationFilter && location !== locationFilter)
    ) {
      el.style.display = "none";
    } else {
      el.style.display = "";
    }
  });
}

export function filterSetup(
  elements: HTMLElement[],
  locationRadio: HTMLInputElement[],
  departmentRadio: HTMLInputElement[]
): void {
  let location = locationRadio.find((el) => el.checked)?.value || "";
  let department = departmentRadio.find((el) => el.checked)?.value || "";

  locationRadio.map((el) =>
    el.addEventListener("change", () => {
      if (!el.checked) return;
      location = el.value;
      filterStaff(elements, location, department);
    })
  );

  departmentRadio.map((el) =>
    el.addEventListener("change", () => {
      if (!el.checked) return;
      department = el.value;
      filterStaff(elements, location, department);
    })
  );

  // Initial filter
  filterStaff(elements, location, department);
}
