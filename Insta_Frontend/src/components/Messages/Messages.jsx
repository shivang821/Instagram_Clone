import './messages.css'
import { motion } from 'framer-motion'
const Messages = () => {
    return (
        <motion.div
            className='messages'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.5 }}
            transition={{
                ease: "linear",
                duration: .5,
            }}
        >Messages
        </motion.div>

    )
}

export default Messages