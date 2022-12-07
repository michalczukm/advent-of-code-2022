import { readFile } from "node:fs/promises"
import { join } from 'node:path'
import { run } from '.'

describe("day 7", () => {
    it("should work for sample input", async () => {
        const sampleInput = await (await readFile(join(__dirname, "./sample-input"))).toString()

        expect(run(sampleInput)).toBe(5)
    })
})