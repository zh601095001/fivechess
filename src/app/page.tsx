"use client"
import Image from "next/image";
import React, {useState} from "react";
import styles from "./page.module.css";

const initBoard = () => Array(20).fill(null).map(() => Array(20).fill(0))
export default function Home() {
    const [data, setData] = useState(initBoard())
    const [winner, setWinner] = useState("")
    let [currentUser, setCurrentUser] = useState(1) // 1 白子 2 黑子
    const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        // @ts-ignore
        const index = e.target?.dataset?.index
        showChess(index, currentUser === 1 ? styles.white : styles.black)
    }
    const showChess = (position: string, color: string) => {
        const classList = document?.querySelector(`div[data-index="${position}"]`)?.classList
        if (!classList || classList.contains(styles.white) || classList.contains(styles.black)) return false
        classList.add(color)
        setCurrentUser(currentUser === 1 ? 2 : 1)
        const [rowIndex, columnIndex] = position.split(" ").map(Number)
        data[rowIndex][columnIndex] = color === styles.white ? 1 : 2
        setData(data)
        const result = checkWin(data)
        if (result) {
            console.log("xxx")
            setWinner(result === 1 ? "白方" : "黑方")
            // @ts-ignore
            document.getElementById("modal")?.showModal();
        }
    }
    const resetBoard = () => {
        setData(initBoard())
        const elements = document?.querySelectorAll(`.${styles.white},.${styles.black}`)
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.classList.remove(styles.white, styles.black)
        }
        // @ts-ignore
        document.getElementById("modal")?.close();
        setCurrentUser(1)
    }

    function checkWin(board: number[][]) {
        const n = board.length; // 假设棋盘是n x n的
        // 检查水平和垂直方向
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - 4; j++) {
                // 水平方向
                if (board[i][j] !== 0 && board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2] && board[i][j] === board[i][j + 3] && board[i][j] === board[i][j + 4]) {
                    return board[i][j];
                }
                // 垂直方向
                if (board[j][i] !== 0 && board[j][i] === board[j + 1][i] && board[j][i] === board[j + 2][i] && board[j][i] === board[j + 3][i] && board[j][i] === board[j + 4][i]) {
                    return board[j][i];
                }
            }
        }
        // 检查对角线方向
        for (let i = 0; i < n - 4; i++) {
            for (let j = 0; j < n - 4; j++) {
                // 主对角线
                if (board[i][j] !== 0 && board[i][j] === board[i + 1][j + 1] && board[i][j] === board[i + 2][j + 2] && board[i][j] === board[i + 3][j + 3] && board[i][j] === board[i + 4][j + 4]) {
                    return board[i][j];
                }
                // 副对角线
                if (board[i][j + 4] !== 0 && board[i][j + 4] === board[i + 1][j + 3] && board[i][j + 4] === board[i + 2][j + 2] && board[i][j + 4] === board[i + 3][j + 1] && board[i][j + 4] === board[i + 4][j]) {
                    return board[i][j + 4];
                }
            }
        }
        return 0; // 无获胜方
    }


    return (
        <main>
            <div className={styles.chessboard} onClick={handleClick}>
                {
                    data.map((row, rowIndex) => {
                        return row.map((column, columnIndex) => {
                            return <div className={styles.cell}>
                                <div className={styles.cellInner} data-index={`${rowIndex} ${columnIndex}`}></div>
                            </div>
                        })
                    })
                }
                <dialog id="modal" className={styles.dialog}>
                    <div style={{
                        width: 200,
                        height: 200,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}>
                        <div style={{
                            margin: 10,
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "red"
                        }}>{winner}获胜
                        </div>
                        <div style={{textAlign: "center"}}>
                            <button style={{
                                margin: 10,
                                background: "green",
                                border: "none",
                                width: 100,
                                height: 30,
                                fontSize: 15,
                                color: "white",
                                borderRadius: 20
                            }}
                                    onClick={resetBoard}>重新开始
                            </button>
                        </div>

                    </div>
                </dialog>
            </div>
        </main>
    );
}


