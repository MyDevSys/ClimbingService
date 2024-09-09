from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin import ModelAdmin
from .models import (
    User,
    UserActivityPrefecture,
    Contract,
    Activity,
    ActivityTag,
    ActivityPhotos,
    ActivityArea,
    ActivityPrefecture,
    MountainPrefecture,
    AreaMountain,
    MountainCourse,
    CourseCheckPoint,
    GenderMaster,
    PrefectureMaster,
    PlanMaster,
    TagMaster,
    AreaMaster,
    MountainMaster,
    CourseMaster,
    CheckPointTypeMaster,
    CheckPointMaster,
    AvgPaceLevelMaster,
    CourseConstantLevelMaster,
)


@admin.register(User)
class ClimbingUserAdmin(UserAdmin):
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal info",
            {
                "fields": (
                    "name",
                    "bio",
                    "phone_number",
                    "birth_year",
                    "gender",
                    "prefecture",
                    "height",
                    "weight",
                    "is_paid",
                )
            },
        ),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login",)}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "is_staff", "is_active"),
            },
        ),
        (
            "Personal info",
            {
                "classes": ("wide",),
                "fields": (
                    "name",
                    "bio",
                    "phone_number",
                    "birth_year",
                    "gender",
                    "prefecture",
                    "height",
                    "weight",
                    "is_paid",
                ),
            },
        ),
    )
    list_display = ("email", "is_superuser", "is_staff", "is_active", "is_paid")
    list_filter = ("is_staff", "is_active", "is_paid")
    search_fields = ("email",)
    ordering = ("id",)

    readonly_fields = ("date_joined", "last_login")


@admin.register(UserActivityPrefecture)
class UserActivityPrefectureAdmin(ModelAdmin):
    list_display = ("id", "user", "prefecture")
    search_fields = ("prefecture__name",)
    ordering = ("id",)


@admin.register(Contract)
class ContractAdmin(ModelAdmin):
    list_display = ("id", "user", "plan")
    search_fields = ("plan__name",)
    ordering = ("id",)


@admin.register(Activity)
class ActivityAdmin(ModelAdmin):
    list_display = ("id", "user", "start_at", "title")
    search_fields = ("user__email", "start_at", "title")
    ordering = ("id",)


@admin.register(ActivityTag)
class ActivityTagAdmin(ModelAdmin):
    list_display = ("id", "activity_user_id", "activity_user_name", "activity_title", "tag_name")
    search_fields = ("tag_name",)
    ordering = ("id",)

    def activity_user_id(self, obj):
        return obj.activity.user.id

    def activity_user_name(self, obj):
        return obj.activity.user.name

    def activity_title(self, obj):
        return obj.activity.title

    def tag_name(self, obj):
        return obj.tag.name

    activity_user_id.short_description = "ユーザーID"
    activity_user_name.short_description = "ユーザー"
    activity_title.short_description = "活動タイトル"
    tag_name.short_description = "タグ名"


@admin.register(ActivityArea)
class ActivityAreaAdmin(ModelAdmin):
    list_display = ("id", "activity_id", "area_name")
    search_fields = ("activity__id", "area__name")
    ordering = ("id",)

    def activity_id(self, obj):
        return obj.activity.id

    def area_name(self, obj):
        return obj.area.name


@admin.register(ActivityPrefecture)
class ActivityPrefectureAdmin(ModelAdmin):
    list_display = ("id", "activity_id", "prefecture_name")
    search_fields = ("activity__id", "prefecture__name")
    ordering = ("id",)

    def activity_id(self, obj):
        return obj.activity.id

    def prefecture_name(self, obj):
        return obj.prefecture.name


@admin.register(ActivityPhotos)
class ActivityPhotosAdmin(ModelAdmin):
    list_display = ("id", "activity", "taken_at")
    search_fields = ("activity", "taken_at")
    ordering = ("id",)


@admin.register(MountainPrefecture)
class MountainPrefectureAdmin(ModelAdmin):
    list_display = ("id", "mountain", "prefecture")
    search_fields = ("mountain__name", "prefecture__name")
    ordering = ("id",)


@admin.register(AreaMountain)
class AreaMountainAdmin(ModelAdmin):
    list_display = ("id", "area", "mountain")
    search_fields = ("area", "mountain")
    ordering = ("id",)


@admin.register(MountainCourse)
class MountainCourseAdmin(ModelAdmin):
    list_display = ("id", "mountain", "course")
    search_fields = ("mountain",)
    ordering = ("id",)


@admin.register(CourseCheckPoint)
class CourseCheckPointAdmin(ModelAdmin):
    list_display = ("id", "course", "checkpoint")
    search_fields = ("course", "checkpoint")
    ordering = ("id",)


@admin.register(GenderMaster)
class GenderMasterAdmin(ModelAdmin):
    list_display = ("id", "name")
    ordering = ("id",)


@admin.register(PrefectureMaster)
class PrefectureMasterAdmin(ModelAdmin):
    list_display = ("id", "name")
    ordering = ("id",)


@admin.register(PlanMaster)
class PlanMasterAdmin(ModelAdmin):
    list_display = ("id", "name", "duration", "price")
    search_fields = ("duration", "price")
    ordering = ("id",)


@admin.register(TagMaster)
class TagMasterAdmin(ModelAdmin):
    list_display = ("id", "name")
    ordering = ("id",)


@admin.register(AreaMaster)
class AreaMasterAdmin(ModelAdmin):
    list_display = ("id", "name")
    ordering = ("id",)


@admin.register(MountainMaster)
class MountainMasterAdmin(ModelAdmin):
    list_display = ("id", "name", "name_ruby", "elevation")
    ordering = ("id",)


@admin.register(CourseMaster)
class CourseMasterAdmin(ModelAdmin):
    list_display = ("id", "name")
    ordering = ("id",)


@admin.register(CheckPointTypeMaster)
class CheckPointTypeMasterAdmin(ModelAdmin):
    list_display = ("type", "type_name")
    ordering = ("type",)


@admin.register(CheckPointMaster)
class CheckPointMasterAdmin(ModelAdmin):
    list_display = ("id", "name")
    ordering = ("id",)


@admin.register(AvgPaceLevelMaster)
class AvgPacePatternMasterAdmin(ModelAdmin):
    list_display = ("id", "min", "max", "level")
    ordering = ("id",)


@admin.register(CourseConstantLevelMaster)
class CourseConstantLevelMasterAdmin(ModelAdmin):
    list_display = ("id", "min", "max", "level")
    ordering = ("id",)
