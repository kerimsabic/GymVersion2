import HText from "@/shared/HText";
import { ClassType, SelectedPage } from "@/shared/types";
import { motion } from "framer-motion";
import Class from "./Class";
import { useGetTrainersQuery } from "@/store/memberSlice";





type Props = {
    setSelectedPage: (value: SelectedPage) => void
}

const OurClasses = ({ setSelectedPage }: Props) => {

    const { data: trainers = [], isLoading, error } = useGetTrainersQuery();

    const trainerClasses = trainers.map(trainer => ({
        name: trainer.firstName + " "+ trainer.lastName,
        email: trainer.email ,
        image: trainer.image  ,
        id: trainer.id
    }));

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading trainers</p>;
    
    return (
        <section id="trainers"className="w-full bg-primary-100 py-40">
            <motion.div
                onViewportEnter={() => setSelectedPage(SelectedPage.OurClasses)}>
                <motion.div
                    className="mx-auto w-5/6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, x: -50 },
                        visible: { opacity: 1, x: 0 },
                    }}>
                    <div>
                        <HText>
                            Our Trainers
                        </HText>
                        <p className="py-5">
                        We offer professional coaching from our highly educated trainers with extensive experience!
                        </p>
                    </div>
                </motion.div>
                <div className="mt-10 h-[370px] w-full overflow-x-auto overflow-y-hidden">
                    <ul className="w-[2800px] whitespace-nowrap">
                        {trainerClasses.map((item: ClassType) => (
                            <Class
                                key={`${item.id}}`}
                                name={item.name}
                                email={item.email}
                                image={item.image}
                                trainerId = {item.id}
                            />
                        ))}
                    </ul>
                </div>
            </motion.div>
        </section>
    )
}

export default OurClasses