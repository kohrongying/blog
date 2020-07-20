---
title: Implementing Role-Based Authorization
date: 2020-02-23 17:55:54
tags:
- rails
- react
---

At work, I was tasked to build an authorization feature for a project.<!-- excerpt --> I did some research and wanted to share my approach to doing things.

Context: a rails backend api and a reactjs frontend. All api requests are authenticated then authorized. The frontend will also store the user's role and display different links on the sidebar for different roles.

## Backend Design

### Designing the Models
{% asset_img 'diagram.svg' 'model' %}

I decided against using available gems like cancancan or pundit as I wanted a simple implementation without the use of external libraries. 

This design allowed a user to have multiple roles. Each role will then have a set of different permissions.

First, I expose the user's permissions through the model file, through the roles table.
```ruby
# user.rb
has_and_belongs_to_many :roles
has_many :permissions, through: :roles

# role.rb
has_and_belongs_to_many :users
has_and_belongs_to_many :permissions

# permission.rb
has_and_belongs_to_many :roles
```

### Authorizing the Controllers
I read some articles and decided to put the authorization logic as part of rails concerns and include it in the application controller.

Each action in the controller will be authorized by a Permission, rather than a Role. Using Permission to authorize routes give a certain level of flexiblity and modularity - we don't have to create new roles to fit authorization rules. We can just change the permissions that each role can take on.

The next thing was to figure out how to define permissions. My first thought that came to mind was for each model, have a UserRead or UserWrite, that will differentiate the index/show methods from the create/update/destroy methods. 

That method is limiting as if your application has over 100 models, your permissions will scale according to the size of your models.

The next thought came after much more considerable thinking - was to group permissions by feature. Permission A allowed creation of invoices; Permission B allowed management of access control. I managed to distill out 20 permissions. The defining of permissions should be deliberated as a permission should not be too general or it'll lose it's purpose, but neither should it be too specific then you'll have too many permissions to handle and remember.


```ruby
# application_controller.rb
attr_reader :current_user
include CheckPermissions

# check_perimssions.rb
module CheckPermissions
  extend ActiveSupport::Concern

  included do
    before_action :check_permission
  end

  def permissions
    {
      comments: {
        index: %w[ViewPost],
        show: %w[ViewPost],
        create: %w[PostComment],
      }
    }
  end

  def check_permission
    controller_permissions = permissions[controller_name.to_sym][action_name.to_sym] || []
    user_permissions = current_user.permissions.uniq.pluck(:name)
    if (controller_permissions & user_permissions).empty?
      # If intersect of controller and user permissions is empty, user is not authorized
      raise(ExceptionHandler::PermissionsError)
    end
  end
end
```

## Designing the Frontend
First, ensure that api calls to the backend are accompanied by catch statements that will display errors if errors are thrown. And if possible, display the reason for the error. For react, I had to use `error.response.data.message` to distill the error message text.

This makes sure your application does not fail even if the current user is authenticated but not authorized to make certain api calls.

Next, I decided to change the display of the sidebar based on user's role. Etc, if Role X has permissions to allow for User Management, and not Role Y, then Role Y should not be able to see a User tab in the sidebar.

For the frontend, I decided to use roles to differentiate rather than permissions, for ease and simplicity sake.

During authentication, I made a call to the backend to retrieve the user's roles and save them. Not on a reducer as it'll be wiped on a refresh, so localStorage/cookies would be sufficient.

Another matrix on the frontend, to display the corresponding sidebar. 

```js
const ROLES = [
  { name: "Admin", access: [1, 1, 1, 1, 1, 1, 1, 1, 1]},
  { name: "Manager", access: [1, 0, 1, 1, 1, 1, 1, 0, 0]},
  { name: "Employee", access: [1, 0, 1, 1, 1, 1, 1, 0, 0]}
];
```

Not the most clear, but it striked a balance between ease to implement and ease to understand.

Anddd that's my story for implementing role based authorization. I had zero knowledge and confidence about doing this but I'm glad it worked out (for now haha)


### References
[Architecting Roles and Permissions, Atrium](https://www.atrium.co/inside-atrium/architecting-roles-permissions/)
[Simple API Permissions](https://chunksofco.de/very-simple-api-permissions-in-rails-d37e21f09ff8)