
import matplotlib.pyplot as plt
import pydicom
import cv2 
from PIL import Image
import numpy as np

filename = ("xray.dcm") 
ds = pydicom.read_file(filename) 
convertimg = ds.pixel_array
scale_percent = 40
width = int(convertimg.shape[1] * scale_percent / 100)
height = int(convertimg.shape[0] * scale_percent / 100)
dim = (width, height)
img = cv2.resize(convertimg, dim, interpolation = cv2.INTER_AREA)

##
ix = -1
iy = -1
drawing = False

def draw_reactangle_with_drag(event, x, y, flags, param):
    global ix, iy, drawing, img
    img2 = cv2.imread("xray.png")
    img2 = cv2.resize(convertimg, dim, interpolation = cv2.INTER_AREA)
           
    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        ix = x
        iy = y


    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing == True:
            cv2.rectangle(img2, pt1=(ix,iy), pt2=(x, y),color=(255,0,0),thickness=2)
            img = img2

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        cv2.rectangle(img2, pt1=(ix,iy), pt2=(x, y),color=(255,0,0),thickness=2)
        img = img2

cv2.namedWindow(winname= "DataMD")
cv2.setMouseCallback("DataMD", draw_reactangle_with_drag)

while True:
    cv2.imshow("DataMD", img)
    if cv2.waitKey(10) == 27:
        break
cv2.destroyAllWindows()
##

#cv2.imshow("DataMD", resized) 
#cv2.waitKey(0)