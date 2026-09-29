import {
  ARCHIVE_CUTOFF_DATE_TIME,
  buildArchiveHistorySelectQuery,
} from "./archiveHistoryQuery";

describe("buildArchiveHistorySelectQuery", () => {
  test("limits archive history to records strictly before 1 January 2023", () => {
    const query = buildArchiveHistorySelectQuery("CONTACT_ID", 2000, 0);

    expect(ARCHIVE_CUTOFF_DATE_TIME).toBe("2023-01-01T00:00:00+10:30");
    expect(query).toContain("(Contact_Details = 'CONTACT_ID')");
    expect(query).toContain(
      "(Contact_History_Info.Date < '2023-01-01T00:00:00+10:30')"
    );
    expect(query).not.toContain("Contact_History_Info.Date <=");
    expect(query).toMatch(/LIMIT 0, 2000$/);
  });

  test("keeps the archive cutoff on the fallback request", () => {
    const query = buildArchiveHistorySelectQuery("CONTACT_ID", 200, 0);

    expect(query).toContain(
      "(Contact_History_Info.Date < '2023-01-01T00:00:00+10:30')"
    );
    expect(query).toMatch(/LIMIT 0, 200$/);
  });
});
