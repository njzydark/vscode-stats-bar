export function formatBytes(data: number, fixedNumber = 0) {
  const KB = 1024;
  const MB = 1024 * 1024;
  const GB = 1024 * 1024 * 1024;

  let formatRes: { data: number; unit: "KB" | "MB" | "GB" };

  if (data < KB) {
    formatRes = {
      data: 0,
      unit: "KB",
    };
  } else if (data < MB) {
    formatRes = {
      data: data / KB,
      unit: "KB",
    };
  } else if (data < GB) {
    formatRes = {
      data: data / MB,
      unit: "MB",
    };
  } else {
    formatRes = {
      data: data / GB,
      unit: "GB",
    };
  }

  return { ...formatRes, data: formatRes.data.toFixed(fixedNumber) };
}

export function formatTimes(data: number) {
  const m = 60;
  const h = 60 * 60;
  const D = 24 * 60 * 60;

  let formatRes: { data: number; unit: "d" | "h" | "m" }[] = [
    {
      data: 0,
      unit: "d",
    },
    {
      data: 0,
      unit: "h",
    },
    {
      data: 0,
      unit: "m",
    },
  ];

  const curDays = Math.floor(data / D);
  const curHours = Math.floor((data - curDays * D) / h);
  const curMinutes = Math.floor((data - curDays * D - curHours * h) / m);

  formatRes[0].data = curDays;
  formatRes[1].data = curHours;
  formatRes[2].data = curMinutes;

  return formatRes;
}
