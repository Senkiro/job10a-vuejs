import { reactive } from "vue";
import { MessageBoxIcon } from "@/constants/messageBoxIcon";

type ConfirmDialogState = {
  visible: boolean;
  title: string;
  message: string;
  icon: MessageBoxIcon;
  resolve: ((value: boolean) => void) | null;
};

export const confirmDialogState = reactive<ConfirmDialogState>({
  visible: false,
  title: "",
  message: "",
  icon: MessageBoxIcon.None,
  resolve: null,
});

export function ShowConfirmDialog(
  message: string,
  title: string | null = null,
  icon: MessageBoxIcon = MessageBoxIcon.None,
): Promise<boolean> {
  if (confirmDialogState.resolve) {
    confirmDialogState.resolve(false);
  }

  confirmDialogState.title = title ?? "Xác nhận";
  confirmDialogState.message = message;
  confirmDialogState.icon = icon;
  confirmDialogState.visible = true;

  return new Promise<boolean>((resolve) => {
    confirmDialogState.resolve = resolve;
  });
}

export function resolveConfirmDialog(result: boolean) {
  confirmDialogState.visible = false;

  if (confirmDialogState.resolve) {
    confirmDialogState.resolve(result);
    confirmDialogState.resolve = null;
  }
}
