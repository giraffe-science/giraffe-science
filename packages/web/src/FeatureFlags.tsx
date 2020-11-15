export class FeatureFlags {
    private readonly flags: Set<string>;

    constructor() {
        this.flags = new Set(window.localStorage.getItem("flags")?.split(",") || [])
    }

    get signIn(): boolean {
        return this.flags.has("sign-in")
    }
}
