import type { SocketConnectionStatus } from "../protocol";

export class ConnectionStatusStore {
  private status: SocketConnectionStatus;
  private readonly onChanged: () => void;

  constructor(
    initialStatus: SocketConnectionStatus,
    onChanged: () => void
  ) {
    this.status = initialStatus;
    this.onChanged = onChanged;
  }

  get(): SocketConnectionStatus {
    return this.status;
  }

  update(next: SocketConnectionStatus): void {
    this.status = next;
    this.onChanged();
  }

  setSilently(next: SocketConnectionStatus): void {
    this.status = next;
  }
}
