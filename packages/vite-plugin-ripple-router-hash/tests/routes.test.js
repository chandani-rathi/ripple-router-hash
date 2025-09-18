import { expect, it, describe} from 'vitest'
import { generateRoutesTree } from '../src/routes';

describe('routes', () => {

  it('generate routes tree on empty array', () => {
    const routes = []
    const tree = generateRoutesTree(routes);
    console.log(tree)
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
    console.log(JSON.stringify(tree, null, 2))
    expect(1).toBe(1)
  })
});
