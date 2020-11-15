export type Listener = (e: any) => void;

export class ErrorReports {
    private listeners: Set<Listener> = new Set<Listener>();
    public readonly reporter: (e: any) => void;

    constructor() {
        const self = this;
        this.reporter = (e: any) => {
            self.report(e);
        }
    }

    add(listener: Listener): ErrorReports {
        if (!this.listeners.has(listener)) {
            this.listeners.add(listener);
        }
        return this;
    }

    report(e: any) {
        this.listeners.forEach(
            listener => {
                try {
                    listener(e);
                } catch (listenerError) {
                    console.log("Error listener failed", listenerError);
                }
            }
        )
    }

    promise<T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T> {
        const self = this;
        return new Promise<T>(executor)
            .catch((e) => {
                self.report(e);
                throw e;
            });
    }
}
