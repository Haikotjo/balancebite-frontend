import PropTypes from "prop-types";
import { createContext, useState } from "react";
import CustomModal from "../components/layout/CustomModal.jsx";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalContent, setModalContent] = useState(null);
    const [modalType, setModalType] = useState(null); // 🆕

    const openModal = (content, type = null) => {
        setModalContent(content);
        setModalType(type); // 🆕
    };

    const closeModal = () => {
        setModalContent(null);
        setModalType(null); // 🆕
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal, modalType }}> {/* 🆕 */}
            {children}
            <CustomModal isOpen={!!modalContent} onClose={closeModal}>
                {modalContent}
            </CustomModal>
        </ModalContext.Provider>
    );
};

ModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
