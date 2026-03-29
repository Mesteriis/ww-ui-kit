# Login Window namespace

Future home for a reusable `LoginWindow` widget.

The eventual widget should:

- compose core fields, actions, and feedback
- stay black-box from the app point of view
- accept auth state and callbacks from the app layer

It must not:

- own backend auth integration
- perform route navigation
- become a route page
