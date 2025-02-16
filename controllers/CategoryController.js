const Category = require("../models/Category.model");

const createCategory = async (req, res) => {
    try {
        const { name, parent, isActive } = req.body;
        const category = new Category({ name, parent: parent || null, isActive });
        await category.save();
        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch categories as a tree
const getCategoriesTree = async (req, res) => {
    try {
        const categories = await Category.aggregate([
            {
                $graphLookup: {
                    from: "categories",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parent",
                    as: "children"
                }
            },
            {
                $match: { parent: null }
            }
        ]);

        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { name, parent, isActive } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, parent: parent || null, isActive },
            { new: true }
        );

        if (!category) return res.status(404).json({ message: "Category not found" });

        if (isActive === false) {
            await Category.updateMany({ parent: req.params.id }, { isActive: false });
        }

        res.json({ message: "Category updated successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete category & reassign subcategories
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        await Category.updateMany({ parent: category._id }, { parent: category.parent });
        await category.deleteOne();

        res.json({ message: "Category deleted and subcategories reassigned" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {
    deleteCategory, updateCategory, createCategory, getCategoriesTree
}