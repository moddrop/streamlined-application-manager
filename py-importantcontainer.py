import sys
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout
from PyQt5.QtGui import QPixmap, QColor
from PyQt5.QtCore import Qt

class ImageCard(QWidget):
    def __init__(self, image_path, label_text):
        super().__init__()
        # Enable styling for the custom QWidget
        self.setAttribute(Qt.WA_StyledBackground, True)
        
        # Set up the main layout
        layout = QVBoxLayout(self)
        
        # Add the image label
        self.image_label = QLabel(self)
        pixmap = QPixmap(image_path)
        self.image_label.setPixmap(pixmap.scaled(100, 100, Qt.KeepAspectRatio))
        self.image_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.image_label)
        
        # Add the text label
        self.text_label = QLabel(label_text, self)
        self.text_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.text_label)
        
        # Apply style sheet
        self.setStyleSheet("""
            ImageCard {
                border: 2px solid blue;
                border-radius: 10px;
                background-color: lightgray;
                padding: 10px;
            }
            QLabel {
                color: black;
                font-size: 14px;
            }
        """)

# --- Main Application Usage ---
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = QWidget()
    main_layout = QVBoxLayout()

    # Create instances of your custom ImageCard
    # (Replace 'path/to/your/image.png' with a real image path)
    card1 = ImageCard('logo.png', 'Item One')
    card2 = ImageCard('swanmelody-icon.png', 'Item Two')

    main_layout.addWidget(card1)
    main_layout.addWidget(card2)
    window.setLayout(main_layout)
    window.show()
    sys.exit(app.exec_())
