#!/usr/bin/env python3
"""
samos_py.py
Python / PyQt5 version of your JS/HTML desktop UI.
Features:
- Left palette: Upload .txt, .mp3/.wav, Images, Open Notes, Cycle Theme, Font size
- Draggable floating windows inside main app for text, image, audio, notes
- Close buttons, play/pause (audio), clock, themes, font size
"""

import sys
import os
from PyQt5.QtCore import Qt, QUrl, QTimer, QTime, QPoint
from PyQt5.QtWidgets import (
    QApplication, QWidget, QMainWindow, QPushButton, QLabel, QTextEdit,
    QFileDialog, QHBoxLayout, QVBoxLayout, QFrame, QSizePolicy
)
from PyQt5.QtGui import QPixmap, QFont
from PyQt5.QtMultimedia import QMediaPlayer, QMediaContent

# ---------- Draggable floating window ----------
class FloatingWindow(QFrame):
    def __init__(self, title="Window", width=360, height=220, parent=None):
        super().__init__(parent, Qt.SubWindow)
        self.setObjectName("FloatingWindow")
        self.setStyleSheet("""
            QFrame#FloatingWindow { background: #C2C2C2; border: 2px solid black; }
        """)
        self.setWindowFlags(Qt.Widget)  # widget inside main window
        self.resize(width, height)
        self.title = QLabel(title, self)
        self.title.setStyleSheet("background: #144FFF; color: white; padding: 4px;")
        self.title.setGeometry(0, 0, width, 28)
        self.close_btn = QPushButton("X", self)
        self.close_btn.setGeometry(width - 34, 2, 30, 24)
        self.close_btn.setStyleSheet("background: rgb(200,50,50); color: white; border: none;")
        self.close_btn.clicked.connect(self.close)
        self.content = QWidget(self)
        self.content.setGeometry(8, 36, width - 16, height - 44)
        self._drag_active = False
        self._drag_pos = QPoint(0, 0)
        self.setMouseTracking(True)

    def mousePressEvent(self, event):
        if event.button() == Qt.LeftButton:
            # if header area clicked -> begin drag
            if event.y() <= 28:
                self._drag_active = True
                self._drag_pos = event.globalPos() - self.frameGeometry().topLeft()
                event.accept()
        super().mousePressEvent(event)

    def mouseMoveEvent(self, event):
        if self._drag_active:
            newpos = event.globalPos() - self._drag_pos
            # keep inside parent bounds if parent exists
            parent = self.parentWidget()
            if parent:
                # limit movement to parent rect
                pr = parent.rect()
                w, h = self.width(), self.height()
                x = max(0, min(newpos.x() - parent.mapToGlobal(parent.rect().topLeft()).x(), pr.width() - w))
                y = max(28, min(newpos.y() - parent.mapToGlobal(parent.rect().topLeft()).y(), pr.height() - h))
                self.move(x, y)
            else:
                self.move(newpos)
            event.accept()
        super().mouseMoveEvent(event)

    def mouseReleaseEvent(self, event):
        self._drag_active = False
        super().mouseReleaseEvent(event)

# ---------- Specialized windows ----------

class TextViewer(FloatingWindow):
    def __init__(self, title, text, parent=None):
        super().__init__(title, parent=parent)
        self.textedit = QTextEdit(self.content)
        self.textedit.setPlainText(text)
        self.textedit.setGeometry(0,0,self.content.width(), self.content.height())
        self.textedit.setStyleSheet("background: white; color: black;")
        self.textedit.setReadOnly(True)
        self.close_btn.clicked.connect(self.close)

class ImageViewer(FloatingWindow):
    def __init__(self, title, image_path, parent=None):
        super().__init__(title, width=480, height=360, parent=parent)
        self.label = QLabel(self.content)
        self.label.setGeometry(0,0,self.content.width(), self.content.height())
        self.label.setAlignment(Qt.AlignCenter)
        self.pixmap = QPixmap(image_path)
        self.update_image()
        self.close_btn.clicked.connect(self.close)

    def update_image(self):
        if self.pixmap and not self.pixmap.isNull():
            scaled = self.pixmap.scaled(self.label.size(), Qt.KeepAspectRatio, Qt.SmoothTransformation)
            self.label.setPixmap(scaled)

    def resizeEvent(self, event):
        super().resizeEvent(event)
        self.content.setGeometry(8, 36, self.width()-16, self.height()-44)
        self.title.setGeometry(0, 0, self.width(), 28)
        self.close_btn.setGeometry(self.width() - 34, 2, 30, 24)
        self.label.setGeometry(0,0,self.content.width(), self.content.height())
        self.update_image()

class AudioPlayer(FloatingWindow):
    def __init__(self, title, audio_path, parent=None):
        super().__init__(title, width=360, height=140, parent=parent)
        self.player = QMediaPlayer(self)
        url = QUrl.fromLocalFile(audio_path)
        self.player.setMedia(QMediaContent(url))
        self.play_btn = QPushButton("Play", self.content)
        self.play_btn.setGeometry(10, 10, 80, 30)
        self.play_btn.clicked.connect(self.toggle_play)
        self.status_label = QLabel("Stopped", self.content)
        self.status_label.setGeometry(100, 12, 200, 24)
        self.close_btn.clicked.connect(self.on_close)

    def toggle_play(self):
        if self.player.state() == QMediaPlayer.PlayingState:
            self.player.pause()
            self.play_btn.setText("Play")
            self.status_label.setText("Paused")
        else:
            self.player.play()
            self.play_btn.setText("Pause")
            self.status_label.setText("Playing")

    def on_close(self):
        try:
            self.player.stop()
        except Exception:
            pass
        self.close()

# ---------- Main window ----------

class SamosMain(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("samos | streamlined application manager")
        self.resize(1200, 720)
        self.central = QWidget(self)
        self.setCentralWidget(self.central)
        self.central.setStyleSheet("background: white;")
        self.font_size = 12
        self.init_ui()
        self.theme_index = 0
        self.themes = [
            {"bg":"white"},
            {"bg":"#0064FF"},
            {"bg":"#FF3C3C"},
            {"bg":"#960096"},
            {"bg":"#14C850"}
        ]

    def init_ui(self):
        layout = QHBoxLayout(self.central)
        left_col = QFrame(self.central)
        left_col.setFixedWidth(170)
        left_col.setStyleSheet("background: #E6E6E6; border: 1px solid black;")
        left_layout = QVBoxLayout(left_col)
        left_layout.setContentsMargins(8,8,8,8)
        left_layout.setSpacing(6)

        btn_txt = QPushButton("Upload .txt File")
        btn_txt.clicked.connect(self.upload_txt)
        left_layout.addWidget(btn_txt)

        btn_audio = QPushButton("Upload .mp3/.wav File")
        btn_audio.clicked.connect(self.upload_audio)
        left_layout.addWidget(btn_audio)

        btn_img = QPushButton("Upload Image (.png/.jpg/.webp)")
        btn_img.clicked.connect(self.upload_image)
        left_layout.addWidget(btn_img)

        btn_notes = QPushButton("Open Notes")
        btn_notes.clicked.connect(self.open_notes)
        left_layout.addWidget(btn_notes)

        btn_theme = QPushButton("Cycle Theme")
        btn_theme.clicked.connect(self.cycle_theme)
        left_layout.addWidget(btn_theme)

        # font size quick buttons
        btn_10 = QPushButton("Font 10")
        btn_10.clicked.connect(lambda: self.set_font_size(10))
        left_layout.addWidget(btn_10)
        btn_15 = QPushButton("Font 15")
        btn_15.clicked.connect(lambda: self.set_font_size(15))
        left_layout.addWidget(btn_15)
        btn_20 = QPushButton("Font 20")
        btn_20.clicked.connect(lambda: self.set_font_size(20))
        left_layout.addWidget(btn_20)
        btn_25 = QPushButton("Font 25")
        btn_25.clicked.connect(lambda: self.set_font_size(25))
        left_layout.addWidget(btn_25)

        left_layout.addStretch()

        # top area (clock)
        right_area = QFrame(self.central)
        right_layout = QVBoxLayout(right_area)
        right_layout.setContentsMargins(8,8,8,8)
        clock_label = QLabel()
        clock_label.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        clock_label.setFixedHeight(28)
        self.clock_label = clock_label
        right_layout.addWidget(clock_label)

        desktop_area = QFrame()
        desktop_area.setFrameShape(QFrame.Box)
        desktop_area.setStyleSheet("background: transparent;")
        desktop_area_layout = QVBoxLayout(desktop_area)
        desktop_area_layout.setContentsMargins(0,0,0,0)
        desktop_area_layout.setSpacing(0)
        right_layout.addWidget(desktop_area)

        layout.addWidget(left_col)
        layout.addWidget(right_area)
        self.floating_parent = desktop_area

        # update clock
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_clock)
        self.timer.start(1000)
        self.update_clock()

        # global font
        app_font = QFont()
        app_font.setPointSize(self.font_size)
        QApplication.instance().setFont(app_font)

        # keep references to floating windows
        self.windows = []

    def update_clock(self):
        t = QTime.currentTime().toString("HH:mm:ss")
        self.clock_label.setText(t)

    def set_font_size(self, sz):
        self.font_size = sz
        app_font = QFont()
        app_font.setPointSize(self.font_size)
        QApplication.instance().setFont(app_font)

    def cycle_theme(self):
        self.theme_index = (self.theme_index + 1) % len(self.themes)
        theme = self.themes[self.theme_index]
        bg = theme["bg"]
        self.central.setStyleSheet(f"background: {bg};")

    def upload_txt(self):
        fname, _ = QFileDialog.getOpenFileName(self, "Open .txt file", "", "Text Files (*.txt);;All Files (*)")
        if not fname:
            return
        try:
            with open(fname, "r", encoding="utf-8", errors="ignore") as f:
                txt = f.read()
        except Exception:
            txt = ""
        w = TextViewer(os.path.basename(fname), txt, parent=self.floating_parent)
        w.move(100, 100)
        w.show()
        self.windows.append(w)

    def upload_image(self):
        fname, _ = QFileDialog.getOpenFileName(self, "Open image", "", "Images (*.png *.jpg *.jpeg *.gif *.webp);;All Files (*)")
        if not fname: return
        w = ImageViewer(os.path.basename(fname), fname, parent=self.floating_parent)
        w.move(120, 120)
        w.show()
        self.windows.append(w)

    def upload_audio(self):
        fname, _ = QFileDialog.getOpenFileName(self, "Open audio", "", "Audio Files (*.mp3 *.wav *.ogg);;All Files (*)")
        if not fname: return
        w = AudioPlayer(os.path.basename(fname), fname, parent=self.floating_parent)
        w.move(140, 140)
        w.show()
        self.windows.append(w)

    def open_notes(self):
        # if notes already exists, focus it
        for w in self.windows:
            if isinstance(w, TextViewer) and w.title.text() == "Notes":
                w.raise_()
                return
        w = TextViewer("Notes", "", parent=self.floating_parent)
        w.textedit.setReadOnly(False)
        w.move(160, 160)
        w.show()
        self.windows.append(w)

# ---------- Run ----------
def main():
    app = QApplication(sys.argv)
    w = SamosMain()
    w.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
