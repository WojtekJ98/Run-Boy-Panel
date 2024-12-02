import moment from "moment";

export default function formatDate(dateString) {
  return moment(dateString).format("Do MMMM  YYYY, h:mm:ss a");
}
