import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel, QWidget, QVBoxLayout, QPushButton
from PyQt5.QtGui import QIcon
from PyQt5.QtCore import Qt

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        
        self.setWindowTitle("My first GUI")
        self.setGeometry(0, 0, 999, 700)
        self.setWindowIcon(QIcon("logo.png"))
        
        self.setup_ui_elements() 

    def setup_ui_elements(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        desktop = QLabel("#1", self)
        taskbar = QLabel("#1", self)
        taskbar.setFixedHeight(50)
        
        desktop.setStyleSheet("background-color: blue;")
        taskbar.setStyleSheet("background-color: purple;")

        desktop.setAlignment(Qt.AlignCenter)
        taskbar.setAlignment(Qt.AlignCenter)
        

        vbox = QVBoxLayout()
        vbox.setSpacing(0)
        vbox.setContentsMargins(0, 0, 0, 0)
        
        vbox.addWidget(desktop)
        vbox.addWidget(taskbar)

        central_widget.setLayout(vbox)

        # pixmap = QPixmap("logo.png") 
        # label.setPixmap(pixmap) 
        # label.setScaledContents(True)

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
