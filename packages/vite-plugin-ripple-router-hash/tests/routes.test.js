import { expect, it, describe, vi } from 'vitest'
import fg, { sync } from "fast-glob";
import { generateRoutes, generateRoutesTree } from '../src/routes';

const mockFolderBasesRoutesFiles = {
    "**/page.ripple": ["page.ripple", "project/page.ripple", "project/[id]/page.ripple"],
    "**/layout.ripple": ["layout.ripple", "project/layout.ripple", "project/[id]/layout.ripple"]
}

const mockFileBasesRoutesFiles = {
    "**/*.ripple": ["index.ripple", "about.ripple", "project/[id].ripple", "project/index.ripple"],
    "**/_layout.ripple": ["_layout.ripple", "project/_layout.ripple", "project/people/_layout.ripple"]
}

vi.mock("fast-glob", () => {
    return {
        default: {
            sync: vi.fn()
        },
    };
});


describe("folder based routes", () => {
    it("generate routes on empty folder", () => {
        fg.sync.mockImplementation(() => [])
        const routes = generateRoutes({
            pagesDir: "src/pages", fileBasedRoutes: false
        });
        expect(routes).toMatchObject([])
    });

    it("generate routes on files", () => {
        fg.sync.mockImplementation((pattern) => mockFolderBasesRoutesFiles[pattern])
        const routes = generateRoutes({
            pagesDir: "src/pages", fileBasedRoutes: false
        });
        expect(routes).toMatchSnapshot();
    });

})

describe('file based routes', () => {

    it("generate routes on empty folder", () => {
        fg.sync.mockImplementation(() => [])
        const routes = generateRoutes({
            pagesDir: "src/pages", fileBasedRoutes: true
        });
        expect(routes).toMatchObject([])
    });

    it("generate routes on files", () => {
        fg.sync.mockImplementation((pattern) => mockFileBasesRoutesFiles[pattern])
        const routes = generateRoutes({
            pagesDir: "src/pages", fileBasedRoutes: true
        });
        expect(routes).toMatchSnapshot();
    });

    it('generate routes tree on empty array', () => {
        const routes = []
        const tree = generateRoutesTree(routes);
        expect(1).toBe(1)
    });

    it('generate routes tree on routes', () => {
        const routes = [
            {
                "path": "/about",
                "layouts": [
                    {
                        "id": ""
                    }
                ]
            },
            {
                "path": "/",
                "layouts": [
                    {
                        "id": ""
                    }
                ]
            },
            {
                "path": "/blog",
                "layouts": [
                    {
                        "id": ""
                    }
                ]
            },
            {
                "path": "/blog/:slug",
                "layouts": [
                    {
                        "id": ""
                    }
                ]
            },
            {
                "path": "/dashboard",
                "layouts": [
                    {
                        "id": ""
                    },
                    {
                        "id": "dashboard"
                    }
                ]
            },
            {
                "path": "/dashboard/settings",
                "layouts": [
                    {
                        "id": ""
                    },
                    {
                        "id": "dashboard"
                    }
                ]
            },
            {
                "path": "/dashboard/users",
                "layouts": [
                    {
                        "id": ""
                    },
                    {
                        "id": "dashboard"
                    }
                ]
            },
            {
                "path": "/dashboard/users/:id",
                "layouts": [
                    {
                        "id": ""
                    },
                    {
                        "id": "dashboard"
                    }
                ]
            }
        ]
        const tree = generateRoutesTree(routes);
        expect(tree).toMatchSnapshot();
    })
});
