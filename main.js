ContentManager.load("shader","shaders/unit_shading.fx");

require("js/utility/math_extension");
require("js/utility/helper");
require("js/utility/game_object");
require("js/utility/state_manager");
require("js/utility/broadcaster");
require("js/level/level");

Game.Initialise = function()
{
	Game.setName("Tiny Quest");
	RenderSettings.setResolution(640,480);
	RenderSettings.setVsync(false);
	RenderSettings.setFullscreen(false);
	RenderSettings.setCullMode(RenderSettings.CullNone);
	RenderSettings.setBackBufferColor(0,0,0,1);
	RenderSettings.setWindowSize(640,480);

	Level.setLocation("eterna_forest");
	StateManager.switchState(LevelState);
}
Game.Update = function(dt)
{	
	if(Keyboard.isReleased("F9"))
	{
		Game.showConsole();
	}

	StateManager.update(dt);
}

Game.Draw = function(dt)
{
	StateManager.draw(dt);
}

Game.Shutdown = function()
{
		
}

Game.OnReload = function()
{
	StateManager.reload()
}
