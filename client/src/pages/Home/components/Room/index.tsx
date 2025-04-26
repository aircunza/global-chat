import { IAuthUser } from "../../../../types/IAuthUser";
import { IRoom } from "../../types/Room";
import styles from "./style/style.module.css";

interface inputs {
  room: IRoom;
  authUser: IAuthUser | null;
  handleDeleteRoom: (roomId: string) => void;
  handleJoin: (room: IRoom) => void;
}

const Room = ({ room, authUser, handleDeleteRoom, handleJoin }: inputs) => {
  return (
    <div key={room.roomId} className={styles.card}>
      <div className={styles.flagsRow}>
        <div className={styles.stat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.avatarIcon}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2c-3.1 0-9.3 1.6-9.3 4.7V22h18.6v-3.3c0-3.1-6.2-4.7-9.3-4.7z" />
          </svg>

          <span style={{ fontSize: "12px", marginLeft: "8px" }}>
            {authUser?.user.name}
          </span>
        </div>

        {room.createdBy === authUser?.user.id ? (
          <button
            className={styles.deleteButton}
            onClick={() => handleDeleteRoom(room.roomId)}
          >
            ❌
          </button>
        ) : (
          <div className={styles.menu}>⋮</div>
        )}
      </div>

      <div className={styles.selectRoom} onClick={() => handleJoin(room)}>
        <h1 className={styles.title}>{room.roomName}</h1>

        <p className={styles.description}>
          Let's talk! <span>🙂</span>
        </p>
      </div>
      <div className={styles.footer}>
        <div className={styles.stat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.icon}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4a2 2 0 00-2 2v14l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
          </svg>
          <span>0</span>
        </div>
        <div className={styles.stat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.icon}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 8a7 7 0 007-7h2a9 9 0 01-18 0h2a7 7 0 007 7z" />
          </svg>
          <span>0</span>
        </div>
      </div>
    </div>
  );
};

export default Room;
