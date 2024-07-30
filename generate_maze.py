import random
import json

# Labyrint dimensioner
width, height = 20, 20

# Maze generation using recursive backtracking
def generate_maze(w, h):
    maze = [[0 for _ in range(w)] for _ in range(h)]

    def carve_passages_from(cx, cy, maze):
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        random.shuffle(directions)
        for direction in directions:
            nx, ny = cx + direction[0] * 2, cy + direction[1] * 2
            if 0 <= nx < w and 0 <= ny < h and maze[ny][nx] == 0:
                maze[cy + direction[1]][cx + direction[0]] = 1
                maze[ny][nx] = 1
                carve_passages_from(nx, ny, maze)

    maze[1][1] = 1
    carve_passages_from(1, 1, maze)
    return maze

def place_holes_and_goal(maze, num_holes):
    h, w = len(maze), len(maze[0])
    holes = []
    empty_spaces = [(y, x) for x in range(1, w, 2) for y in range(1, h, 2) if maze[y][x] == 1]
    
    # Ensure there are enough empty spaces to place holes and goal
    if len(empty_spaces) < num_holes + 1:
        raise ValueError("Not enough space to place holes and goal.")
    
    # Place goal
    goal_position = random.choice(empty_spaces)
    empty_spaces.remove(goal_position)
    goal = {"x": goal_position[1] * 10, "y": goal_position[0] * 10, "radius": 10}

    # Place holes ensuring 8 empty surrounding cells
    def is_valid_hole_position(pos):
        y, x = pos
        for dy in range(-1, 2):
            for dx in range(-1, 2):
                ny, nx = y + dy * 2, x + dx * 2
                if 0 <= ny < h and 0 <= nx < w and maze[ny][nx] == 0:
                    return False
        return True

    while len(holes) < num_holes:
        position = random.choice(empty_spaces)
        if is_valid_hole_position(position):
            empty_spaces.remove(position)
            holes.append({"x": position[1] * 10, "y": position[0] * 10, "radius": 10})

    return holes, goal

# Generate the maze
maze = generate_maze(width, height)

# Place holes and goal
holes, goal = place_holes_and_goal(maze, 40)

# Convert to JSON
data = {
    "maze": [],
    "holes": holes,
    "goal": goal
}

for y in range(height):
    for x in range(width):
        if maze[y][x] == 0:
            data["maze"].append({"x1": x * 10, "y1": y * 10, "x2": (x + 1) * 10, "y2": (y + 1) * 10})

with open('bane.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)

print("Maze and holes generated and saved to bane.json")
