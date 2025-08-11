// src/utils/staff-filter.ts

type FilterType = "location" | "department";

interface FilterOptions {
  type: FilterType;
  value: string;
}

export function filterStaff(
  staffElements: HTMLElement[],
  { type, value }: FilterOptions
): void {
  const dataAttr = type === "location" ? "data-location" : "data-department";

  staffElements.forEach((el) => {
    const attrValue = el.getAttribute(dataAttr);
    if (!value || attrValue === value) {
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });
}

export function filterSetup(
  elements: HTMLElement[],
  locationRadio: HTMLInputElement[],
  departmentRadio: HTMLInputElement[]
): void {
  locationRadio.map((el) =>
    el.addEventListener("change", () => {
      if (!el.checked) return;
      const value = el.value;
      filterStaff(elements, { type: "location", value });
    })
  );

  departmentRadio.map((el) =>
    el.addEventListener("change", () => {
      if (!el.checked) return;
      const value = el.value;
      filterStaff(elements, { type: "department", value });
    })
  );

  // Get initial values from radio buttons
  const initialLocation = locationRadio.find((el) => el.checked)?.value || "";
  const initialDepartment =
    departmentRadio.find((el) => el.checked)?.value || "";

  // Initial filter
  filterStaff(elements, { type: "location", value: initialLocation });
  filterStaff(elements, { type: "department", value: initialDepartment });
}
