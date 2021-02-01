# I'm a bit faster at Python, so let's tear through...
import math

def gen_circle_coords(radius, resolution, offset_x = 0, offset_y = 0):
	"""
	:param radius: Keep it 1 or less since we do relative coords
	:resolution: Roughly, number of points to generate
	"""
	gen_arc_coords(0, 360, radius, resolution, offset_x, offset_y)

def gen_arc_coords(start, end, radius, resolution, offset_x = 0, offset_y = 0):
	"""
	:param radius: Keep it 1 or less since we do relative coords
	:resolution: Roughly, number of points to generate
	"""
	points = []
	for degree in range(start, end)[::int(abs(end-start)/resolution)]:
		# I can't even begin to guess why the - is necessary.
		degree = math.radians(-degree)
		# +0.5 to center
		points.append([0.5+radius*math.cos(degree)+offset_x, 0.5+radius*math.sin(degree)+offset_y])
	if(abs(end-start)==360):
		points.append(points[0])  # To make the circle rejoin itself at any resolution
	print(str(points)+",")

gen_arc_coords(-15, 15, 0.2, 12)
gen_arc_coords(90, 135, 0.1, 16)
gen_arc_coords(40, 75, 0.3, 12)
gen_arc_coords(160, 175, 0.2, 8)
gen_arc_coords(250, 288, 0.3, 16)
gen_arc_coords(0, 40, 0.1, 16)
gen_arc_coords(220, 275, 0.2, 12)
