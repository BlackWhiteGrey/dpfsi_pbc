/**
 * Created by Wyj on 17/5/17.
 */
export const formatDate = (timestamp) => {
  timestamp = typeof timestamp === 'number' ? timestamp : Number(timestamp);
  const date = new Date(timestamp);
  const Y = date.getFullYear() + '-';
  const M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  const h =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  const m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':';
  const s =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
};
