// Midnight at the start of 1 January 2023 in Australia/Adelaide (DST).
export const ARCHIVE_CUTOFF_DATE_TIME = "2023-01-01T00:00:00+10:30";

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
  offset = 0
) =>
  `select ${ARCHIVE_HISTORY_SELECT_FIELDS} from History_X_Contacts where (Contact_Details = '${contactId}') and (Contact_History_Info.Date < '${ARCHIVE_CUTOFF_DATE_TIME}') LIMIT ${offset}, ${limit}`;
