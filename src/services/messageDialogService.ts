import { reactive } from "vue";
import { MessageBoxIcon } from "@/constants/messageBoxIcon";

type MessageDialogState = {
  visible: boolean;
  title: string;
  message: string;
  icon: MessageBoxIcon;
  resolve: (() => void) | null;
};

export const messageDialogState = reactive<MessageDialogState>({
  visible: false,
  title: "",
  message: "",
  icon: MessageBoxIcon.None,
  resolve: null,
});

export function ShowMessageDialog(
  message: string,
  title: string | null = null,
  icon: MessageBoxIcon = MessageBoxIcon.None,
): Promise<void> {
  if (messageDialogState.resolve) {
    messageDialogState.resolve();
  }

  messageDialogState.title = title ?? "Thông báo";
  messageDialogState.message = message;
  messageDialogState.icon = icon;
  messageDialogState.visible = true;

  return new Promise<void>((resolve) => {
    messageDialogState.resolve = resolve;
  });
}

export function closeMessageDialog() {
  messageDialogState.visible = false;

  if (messageDialogState.resolve) {
    messageDialogState.resolve();
    messageDialogState.resolve = null;
  }
}
