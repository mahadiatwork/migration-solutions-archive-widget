// Midnight at the start of 1 January 2023 in Australia/Adelaide (DST).
export const ARCHIVE_CUTOFF_DATE_TIME = "2023-01-01T00:00:00+10:30";
export const ARCHIVE_HISTORY_ORDER =
  "order by Contact_History_Info.Date desc, id desc";

const ARCHIVE_HISTORY_SELECT_FIELDS = [
  "Name",
  "id",
  "Contact_History_Info.id",
  "Owner.first_name",
  "Owner.last_name",
  "Contact_Details.Full_Name",
  "Contact_History_Info.History_Type",
  "Contact_History_Info.History_Result",
  "Contact_History_Info.Duration",
  "Contact_History_Info.Regarding",
  "Contact_History_Info.History_Details_Plain",
  "Contact_History_Info.Date",
  "Contact_History_Info.Stakeholder",
].join(",");

export const buildArchiveHistorySelectQuery = (
  contactId,
  limit = 2000,
  offset = 0,
  cursor = null
) => {
  const whereClauses = [
    `(Contact_Details = '${contactId}')`,
    `(Contact_History_Info.Date < '${ARCHIVE_CUTOFF_DATE_TIME}')`,
  ];

  if (cursor?.date && cursor?.id) {
    whereClauses.push(
      `((Contact_History_Info.Date < '${cursor.date}') or (Contact_History_Info.Date = '${cursor.date}' and id < '${cursor.id}'))`
    );
  }

  const pagination = cursor
    ? `LIMIT 0, ${limit}`
    : `LIMIT ${offset}, ${limit}`;

  return `select ${ARCHIVE_HISTORY_SELECT_FIELDS} from History_X_Contacts where ${whereClauses.join(
    " and "
  )} ${ARCHIVE_HISTORY_ORDER} ${pagination}`;
};
