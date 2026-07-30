import { fireEvent, render, screen } from "@testing-library/react";
import { SnackbarProvider } from "notistack";
import { Table } from "./Table";

test("shows 100 history rows per page", () => {
  const rows = Array.from({ length: 101 }, (_, index) => ({
    id: String(index + 1),
    name: `Record ${index + 1}`,
    date_time: new Date(Date.UTC(2026, 0, 1, 0, 0, 101 - index)).toISOString(),
  }));

  render(
    <SnackbarProvider>
      <Table rows={rows} />
    </SnackbarProvider>
  );

  expect(screen.queryByText("Record 101")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /next page/i }));
  expect(screen.getByText("Record 101")).not.toBeNull();
});
