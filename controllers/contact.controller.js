// ========================= contact.controller.js (COMPLETE & SIMPLIFIED) =========================
import Contact from "../models/contact.model.js";
import Property from "../models/property.model.js";
import sendResponse from "../utils/apiResponse.js";

/**
 * CREATE CONTACT - 99acres jaisa
 */
export const createContact = async (req, res) => {
  try {
    const { propertyId, message } = req.body;

    const property = await Property.findById(propertyId).populate(
      "owner",
      "name email phone"
    );

    if (!property || !property.isActive || property.isFlagged) {
      return sendResponse(res, 404, false, "Property not found");
    }

    if (property.owner._id.toString() === req.user._id.toString()) {
      return sendResponse(
        res,
        400,
        false,
        "You cannot contact your own property"
      );
    }

    const contact = await Contact.create({
      property: propertyId,
      buyer: req.user._id,
      owner: property.owner._id,
      message,
    });

    return sendResponse(
      res,
      201,
      true,
      "Contact request sent. Here are owner details:",
      {
        contact,
        ownerDetails: {
          name: property.owner.name,
          email: property.owner.email,
          phone: property.owner.phone,
        },
      }
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * GET MY CONTACTS
 */
export const getMyContacts = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : {
            $or: [{ buyer: req.user._id }, { owner: req.user._id }],
          };

    const contacts = await Contact.find(filter)
      .populate("property", "title price address images")
      .populate("buyer", "name email phone")
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    return sendResponse(
      res,
      200,
      true,
      "Contacts fetched successfully",
      contacts
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * GET SINGLE CONTACT
 */
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate("property")
      .populate("buyer", "name email phone")
      .populate("owner", "name email phone");

    if (!contact) {
      return sendResponse(res, 404, false, "Contact not found");
    }

    if (
      contact.buyer._id.toString() !== req.user._id.toString() &&
      contact.owner._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return sendResponse(res, 403, false, "Access denied");
    }

    return sendResponse(
      res,
      200,
      true,
      "Contact fetched successfully",
      contact
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * DELETE CONTACT
 */
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return sendResponse(res, 404, false, "Contact not found");
    }

    if (
      contact.buyer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return sendResponse(res, 403, false, "Access denied");
    }

    await contact.deleteOne();

    return sendResponse(res, 200, true, "Contact deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
