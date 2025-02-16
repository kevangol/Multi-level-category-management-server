const Category = require("../models/Category.model");

const createCategory = async (data) => {
    const { name, parent, isActive } = data;
    const category = new Category({ name, parent: parent || null, isActive });
    return await category.save();
};

const getCategoriesTree = async () => {
    return await Category.aggregate([
        {
            $graphLookup: {
                from: "categories",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent",
                as: "children",
            }
        },
        { $match: { parent: null } }
    ]);
};

const updateCategory = async (id, data) => {
    const { name, parent, isActive } = data;
    const category = await Category.findByIdAndUpdate(
        id,
        { name, parent: parent || null, isActive },
        { new: true }
    );

    if (category && isActive === false) {
        await Category.updateMany({ parent: id }, { isActive: false });
    }

    return category;
};

const deleteCategory = async (id) => {
    const category = await Category.findById(id);
    if (!category) return null;

    await Category.updateMany({ parent: category._id }, { parent: category.parent });
    await category.deleteOne();
    return category;
};

module.exports = {
    createCategory,
    getCategoriesTree,
    updateCategory,
    deleteCategory
};
