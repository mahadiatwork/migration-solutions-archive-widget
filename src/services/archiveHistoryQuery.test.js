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

  test("uses a stable cursor for subsequent archive pages", () => {
    const query = buildArchiveHistorySelectQuery("CONTACT_ID", 2000, 0, {
      date: "2022-12-30T13:08:00+10:30",
      id: "HISTORY_ID",
    });

    expect(query).toContain(
      "((Contact_History_Info.Date < '2022-12-30T13:08:00+10:30') or (Contact_History_Info.Date = '2022-12-30T13:08:00+10:30' and id < 'HISTORY_ID'))"
    );
    expect(query).toContain(
      "order by Contact_History_Info.Date desc, id desc"
    );
    expect(query).toMatch(/LIMIT 0, 2000$/);
  });
});
