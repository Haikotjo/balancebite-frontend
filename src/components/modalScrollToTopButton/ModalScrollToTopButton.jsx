// src/features/meals/components/modal/ModalScrollToTopButton.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronsUp } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import CustomIconButton from "../layout/CustomIconButton.jsx";

const ModalScrollToTopButton = ({ targetRef }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = targetRef?.current;
        if (!el) return;

        const onScroll = () => {
            setVisible(el.scrollTop > 200);
        };

        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, [targetRef]);

    const scrollToTop = () => {
        const el = targetRef?.current;
        if (!el) return;
        el.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return null;

    return (
        <CustomBox className="absolute bottom-4 right-4 z-[2147483003]">
            <CustomIconButton
                onClick={scrollToTop}
                icon={<ChevronsUp size={20} className="text-white" />}
                bgColor="bg-primary"
                size={30}
            />
        </CustomBox>
    );
};

ModalScrollToTopButton.propTypes = {
    targetRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default ModalScrollToTopButton;
