export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "notify"
  | "message";

export type ToastInput = {
  title?: string;
  description: string;
  duration?: number;
};

export type ToastRecord = ToastInput & {
  id: string;
  type: ToastType;
  createdAt: number;
  duration: number;
};
