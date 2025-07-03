import BulletText from "../../../components/layout/BulletText.jsx";

const ingredients = [
    "Rijst",
    "Kip",
    "Broccoli",
    "Olijfolie",
    "Zout",
];

const IngredientsPage = () => {
    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Ingredient</h1>
            <div className="flex flex-col gap-2">
                {ingredients.map((item, index) => (
                    <BulletText key={index}>
                        {item}
                    </BulletText>
                ))}
            </div>
        </div>
    );
};

export default IngredientsPage;