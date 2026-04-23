import List "mo:core/List";



actor {
  public type MovementQuote = {
    id : Text;
    customerName : Text;
    customerPhone : Text;
    fromAddress : Text;
    toAddress : Text;
    items : Text;
    estimatedDate : Text;
    createdAt : Int;
  };

  public type Contact = {
    id : Text;
    name : Text;
    phone : Text;
    address : Text;
    itemCount : Text;
    message : Text;
    createdAt : Int;
  };

  let movementQuotes = List.empty<MovementQuote>();
  let contacts = List.empty<Contact>();

  public shared func addMovementQuote(quote : MovementQuote) : async Bool {
    movementQuotes.add(quote);
    true;
  };

  public shared func addContactRequest(contact : Contact) : async Bool {
    contacts.add(contact);
    true;
  };

  public query func getMovementQuotes() : async [MovementQuote] {
    movementQuotes.toArray();
  };

  public query func getContactRequests() : async [Contact] {
    contacts.toArray();
  };
};
