
import matplotlib.pyplot as plt
import pydicom
import cv2  
import numpy as np
import sys
import selectingwindow
sys.setrecursionlimit(10 ** 9)

filename = ("xray.dcm") 
ds = pydicom.read_file(filename) 
dicomImg = ds.pixel_array
newImg = cv2.cvtColor(dicomImg, cv2.COLOR_GRAY2RGB)
scale_percent = 40
width = int(newImg.shape[1] * scale_percent / 100)
height = int(newImg.shape[0] * scale_percent / 100)
dim = (width, height)
img = cv2.resize(newImg, dim, interpolation = cv2.INTER_AREA)

wName = "DataMD"
imageWidth = 320
imageHeight = 240
rectI = selectingwindow.DragRectangle(img, wName, imageWidth, imageHeight)

cv2.namedWindow(rectI.wname)
cv2.setMouseCallback(rectI.wname, selectingwindow.dragrect, rectI)

while True:
    cv2.imshow(wName, rectI.image)
    key = cv2.waitKey(1) & 0xFF

    if rectI.returnflag:
        break

print("Rectangle Coordinates")
#print(str(rectI.outRect.x) + ',' + str(rectI.outRect.y) + ',' + \
 #     str(rectI.outRect.w + rectI.outRect.x) + ',' + str(rectI.outRect.h + rectI.outRect.y))

print("x:" + str(rectI.outRect.x) + " y:" + str(rectI.outRect.y) )
print("\nw:" + str(rectI.outRect.w+rectI.outRect.x) + " h:" + str(rectI.outRect.h+rectI.outRect.y) )
cv2.destroyAllWindows()