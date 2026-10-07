import { describe, expect, it } from "vitest";
import { LAUNCH_NETWORK, supplyBaseUnits, validateToken } from "@/lib/token-launch";

describe("Devnet launch safeguards", () => {
  it("never selects mainnet", () => { expect(LAUNCH_NETWORK).toBe("devnet"); });
  it("uses integer units for the billion-token supply", () => { expect(supplyBaseUnits("1000000000")).toBe(1000000000000000n); });
  it("rejects invalid or excessive supplies", () => {
    for (const supply of ["0", "-1", "1.5", "1000000001"]) expect(validateToken({ name: "Nyra", symbol: "NYRA", supply })).not.toBeNull();
    expect(validateToken({ name: "Nyra", symbol: "NYRA", supply: "1000000000" })).toBeNull();
  });
  it("limits symbols to eight alphanumeric characters", () => {
    expect(validateToken({ name: "Nyra", symbol: "TOOLONG99", supply: "1" })).not.toBeNull();
    expect(validateToken({ name: "Nyra", symbol: "NYRA!", supply: "1" })).not.toBeNull();
  });
});