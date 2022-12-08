import { readFile } from "node:fs/promises"
import { join } from 'node:path'
import { runPartOne, runPartTwo } from '.'

describe("day 7", () => {
    it("part one should work for sample input", async () => {
        const sampleInput = await (await readFile(join(__dirname, "./sample-input"))).toString()

        expect(runPartOne(sampleInput)).toBe(95437)
    })

    it.only("part two should work for sample input", async () => {
        const sampleInput = await (await readFile(join(__dirname, "./sample-input"))).toString()

        expect(runPartTwo(sampleInput)).toBe(24933642)
    })
})